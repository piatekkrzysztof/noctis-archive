varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uGlow;
uniform vec3  uCamPos;

void main() {
  // Fresnel rim
  vec3 viewDir = normalize(uCamPos - vWorldPos);
  float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.8);

  // Scan lines
  float scan = smoothstep(0.96, 1.0, sin(vUv.y * 44.0 + uTime * 1.6) * 0.5 + 0.5) * 0.28;

  // Grid shimmer
  float grid = smoothstep(0.88, 1.0,
    max(abs(sin(vUv.x * 22.0)), abs(sin(vUv.y * 22.0)))
  ) * 0.08;

  vec3  col   = uColor * 0.07 + uColor * fresnel * uGlow + uColor * (scan + grid);
  float alpha = clamp(fresnel * uGlow * 0.88 + 0.04 + scan * 0.26 + grid * 0.18, 0.0, 1.0);

  gl_FragColor = vec4(col, alpha);
}
