export function verifyType(valor: any) {
  const val = Object.prototype.toString.call(valor);
  const type = val.substring(val.indexOf(" ") + 1, val.indexOf("]"));

  return type.toLowerCase();
}
