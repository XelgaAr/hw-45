import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) {
      return <main style={{ maxWidth: 600, margin: '10vh auto', padding: 24, fontFamily: 'system-ui' }}>

        <h1>Не удалось открыть приложение</h1>

        <p>Обновите страницу. Если ошибка повторяется, проверьте консоль браузера.</p>

        <button onClick={() => window.location.reload()}>Обновить страницу</button>

      </main>;
    }
    return this.props.children;
  }
}
