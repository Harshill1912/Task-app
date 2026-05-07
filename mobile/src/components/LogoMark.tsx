import { StyleSheet, View } from "react-native";

export function LogoMark({ size = 42 }: { size?: number }) {
  const scale = size / 42;
  const inset = size * 0.11;

  return (
    <View
      style={[
        styles.wrap,
        {
          borderRadius: size / 2,
          height: size,
          width: size
        }
      ]}
    >
      <View
        style={[
          styles.cyanArc,
          {
            borderRadius: size / 2,
            height: size,
            width: size
          }
        ]}
      />
      <View
        style={[
          styles.innerCircle,
          {
            borderRadius: (size - inset * 2) / 2,
            bottom: inset,
            left: inset,
            right: inset,
            top: inset
          }
        ]}
      />
      <View
        style={[
          styles.checkLeft,
          {
            borderRadius: 2 * scale,
            height: 8 * scale,
            left: 9 * scale,
            top: 22 * scale,
            width: 18 * scale
          }
        ]}
      />
      <View
        style={[
          styles.checkRight,
          {
            borderRadius: 2 * scale,
            height: 8 * scale,
            left: 18 * scale,
            top: 18 * scale,
            width: 27 * scale
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#0785f2",
    overflow: "hidden",
    position: "relative"
  },
  cyanArc: {
    backgroundColor: "#18cbd4",
    left: -13,
    position: "absolute",
    top: -2
  },
  innerCircle: {
    backgroundColor: "#f7f7f9",
    position: "absolute"
  },
  checkLeft: {
    backgroundColor: "#12cbd4",
    position: "absolute",
    transform: [{ rotate: "45deg" }]
  },
  checkRight: {
    backgroundColor: "#087df0",
    position: "absolute",
    transform: [{ rotate: "-45deg" }]
  }
});
