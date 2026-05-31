function logger(message, type = "log") {
  if (process.env.REACT_APP_ENV === "Development") {
    // We fetch the correct native console function
    const nativeConsoleFunc = console[type] || console.log;

    // We use .bind() to pass the arguments without executing it here.
    // This hands execution back to the caller file, preserving the stack trace!
    return nativeConsoleFunc.bind(console, message);
  }

  // Return a no-operation function for production environment
  return () => { };
}

export default logger;