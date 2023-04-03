export default function appendChildren(parent, ...children) {
  children.forEach((child) => parent.append(child))
}
