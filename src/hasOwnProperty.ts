export default function hasOwnProperty<
  X extends Record<Y, unknown>,
  Y extends PropertyKey
>(prop: Y, obj: X): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
