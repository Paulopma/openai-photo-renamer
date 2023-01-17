import { useState } from "react";

export default function TextArea() {
  const [textInput, setTextInput] = useState('');

  return (
    <textarea
      placeholder="Coloque o texto da conversa aqui"
      aria-label="Use aria labels when no actual label is in use"
      value={textInput}
      onChange={(e) => setTextInput(e.target.value)}
    />
  )
}