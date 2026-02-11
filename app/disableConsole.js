// Bloqueia console.log, console.error e console.warn em produção
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
}
