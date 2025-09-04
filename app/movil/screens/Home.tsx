import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  PanResponder,
  Linking,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

export default function Home() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // refs de opciones
  const carRef = useRef(null);
  const ambRef = useRef(null);
  const munRef = useRef(null);
  const optionCenters = useRef({ car: null, amb: null, mun: null });

  // FAB inicial
  const FAB_SIZE = 90;
  const initialX = (width - FAB_SIZE) / 2;
  const initialY = height - 180;

  const drag = useRef(
    new Animated.ValueXY({ x: initialX, y: initialY })
  ).current;
  const longPressTimer = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permiso de ubicación denegado");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  useEffect(() => {
    drag.setValue({ x: initialX, y: initialY });
  }, []);

  useEffect(() => {
    const measureAll = () => {
      const refs = [
        { ref: carRef, key: "car" },
        { ref: ambRef, key: "amb" },
        { ref: munRef, key: "mun" },
      ];
      refs.forEach(({ ref, key }) => {
        if (ref.current && ref.current.measureInWindow) {
          setTimeout(() => {
            ref.current.measureInWindow((x, y, w, h) => {
              optionCenters.current[key] = {
                x: x + w / 2,
                y: y + h / 2,
                r: Math.max(w, h) / 2,
              };
            });
          }, 0);
        }
      });
    };
    measureAll();
    const t1 = setTimeout(measureAll, 200);
    const t2 = setTimeout(measureAll, 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [showOptions]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        longPressTimer.current = setTimeout(() => {
          setIsDragging(true);
          setShowOptions(true);
        }, 300);
      },

      onPanResponderMove: (evt, gestureState) => {
        const pageX = evt.nativeEvent.pageX;
        const pageY = evt.nativeEvent.pageY;
        if (isDragging) {
          drag.setValue({ x: pageX - FAB_SIZE / 2, y: pageY - FAB_SIZE / 2 });
        } else {
          if (
            Math.abs(gestureState.dx) > 8 ||
            Math.abs(gestureState.dy) > 8
          ) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
          }
        }
      },

      onPanResponderRelease: (evt) => {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
        const pageX = evt.nativeEvent.pageX;
        const pageY = evt.nativeEvent.pageY;

        if (isDragging) {
          const centers = optionCenters.current;
          const hitKey = Object.keys(centers).find((k) => {
            const c = centers[k];
            if (!c) return false;
            const dx = pageX - c.x;
            const dy = pageY - c.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist <= c.r + 30;
          });
          if (hitKey) {
            if (hitKey === "car") dialNumber("133");
            else if (hitKey === "amb") dialNumber("132");
            else if (hitKey === "mun") dialNumber("135");
          }
          setIsDragging(false);
          setShowOptions(false);
          Animated.spring(drag, {
            toValue: { x: initialX, y: initialY },
            useNativeDriver: false,
            friction: 6,
          }).start();
        } else {
          setShowOptions((s) => !s);
        }
      },

      onPanResponderTerminate: () => {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
        setIsDragging(false);
        setShowOptions(false);
        Animated.spring(drag, {
          toValue: { x: initialX, y: initialY },
          useNativeDriver: false,
          friction: 6,
        }).start();
      },
    })
  ).current;

  const dialNumber = async (num) => {
    const url = `tel:${num}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) Linking.openURL(url);
      else Alert.alert("Error", `No se pudo abrir el marcador para ${num}`);
    } catch (e) {
      Alert.alert("Error", "No se pudo realizar la acción");
    }
  };

  if (errorMsg) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ {errorMsg}</Text>
        <Text style={styles.errorSubtext}>
          Necesitamos acceso a tu ubicación para mostrarte el mapa
        </Text>
      </View>
    );
  }
  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>📍 Obteniendo ubicación...</Text>
      </View>
    );
  }

  // 🔹 Marcadores de ejemplo (puedes reemplazar por datos reales)
  const markers = [
    {
      id: 1,
      title: "Comisaría Central",
      description: "Estación de Carabineros",
      coordinate: {
        latitude: location.latitude + 0.002,
        longitude: location.longitude + 0.002,
      },
    },
    {
      id: 2,
      title: "Hospital General",
      description: "Emergencias 24/7",
      coordinate: {
        latitude: location.latitude - 0.002,
        longitude: location.longitude - 0.001,
      },
    },
    {
      id: 3,
      title: "Plaza Principal",
      description: "Zona recreativa",
      coordinate: {
        latitude: location.latitude + 0.001,
        longitude: location.longitude - 0.002,
      },
    },
  ];

  const isImportantMarker = (title = "", description = "") => {
    const text = `${title} ${description}`.toLowerCase();
    if (text.includes("comisaria")) return "blue";
    if (text.includes("hospital")) return "green";
    return null;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent />

      <MapView
        style={StyleSheet.absoluteFillObject}
        region={location}
        showsUserLocation
        followsUserLocation
      >
        {markers.map((m) => {
          const highlight = isImportantMarker(m.title, m.description);
          return (
            <Marker
              key={m.id}
              coordinate={m.coordinate}
              title={m.title}
              description={m.description}
              pinColor={highlight || "#FF6B6B"}
            >
              {highlight ? (
                <View
                  style={[
                    styles.customMarker,
                    { backgroundColor: highlight },
                  ]}
                >
                  <Text style={styles.markerEmoji}>
                    {highlight === "blue" ? "👮‍♂️" : "🏥"}
                  </Text>
                </View>
              ) : null}
            </Marker>
          );
        })}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SegurUp</Text>
        <Text style={styles.headerSubtitle}>
          Tu seguridad, nuestra prioridad
        </Text>
      </View>

      {/* Opciones laterales */}
      <View pointerEvents="box-none" style={styles.optionsContainer}>
        <View style={styles.sideButtons}>
          <TouchableOpacity
            style={styles.sideButton}
            onPress={() => Alert.alert("Reporte")}
          >
            <Text style={styles.sideButtonIcon}>📝</Text>
            <Text style={styles.sideButtonLabel}>REPORTE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sideButton}
            onPress={() => Alert.alert("Ajustes")}
          >
            <Text style={styles.sideButtonIcon}>⚙️</Text>
            <Text style={styles.sideButtonLabel}>AJUSTES</Text>
          </TouchableOpacity>
        </View>

        {/* Botón central SOS estilo pokebola */}
        <Animated.View
          style={[
            styles.fab,
            {
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: FAB_SIZE / 2,
              transform: drag.getTranslateTransform(),
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View
            style={[
              styles.fabInner,
              isDragging ? styles.fabDragging : null,
            ]}
          >
            <View style={styles.fabTop} />
            <View style={styles.fabBottom} />
            <View style={styles.fabCenter}>
              <Text style={styles.fabEmoji}>🚨</Text>
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const STATUS_BAR_HEIGHT =
  Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: STATUS_BAR_HEIGHT,
    paddingBottom: 12,
    backgroundColor: "rgba(44,62,80,0.9)",
    alignItems: "center",
    zIndex: 20,
  },
  headerTitle: { fontSize: 22, color: "#fff", fontWeight: "800" },
  headerSubtitle: { fontSize: 13, color: "#dfe6e9", marginTop: 2 },

  optionsContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 220,
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 30,
  },
  sideButtons: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sideButton: {
    width: 90,
    height: 90,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  sideButtonIcon: { fontSize: 28 },
  sideButtonLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    color: "#2c3e50",
  },

  fab: { position: "absolute", zIndex: 40 },
  fabInner: {
    flex: 1,
    borderRadius: 999,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  fabTop: { flex: 1, backgroundColor: "#e74c3c" },
  fabBottom: { flex: 1, backgroundColor: "#fff" },
  fabCenter: {
    position: "absolute",
    top: "35%",
    left: "35%",
    width: "30%",
    height: "30%",
    borderRadius: 999,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center",
  },
  fabEmoji: { fontSize: 22, color: "#fff" },
  fabDragging: { transform: [{ scale: 1.05 }] },

  customMarker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  markerEmoji: { fontSize: 20, color: "#fff" },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: { fontSize: 18, color: "#2c3e50" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubtext: { fontSize: 14, color: "#7f8c8d", textAlign: "center" },
});
    