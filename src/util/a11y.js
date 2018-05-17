export default function a11yClick(onClick) {
  return function handleEvent(event) {
    if (event.type === 'click') {
      return onClick(event);
    } else if (event.type === 'keypress') {
      const code = event.charCode || event.keyCode;
      if ((code === 32) || (code === 13)) {
        return onClick(event);
      }
    }
    return false;
  };
}
