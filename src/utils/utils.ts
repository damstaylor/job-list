const snakify = (str: string): string => {
  return str.toLowerCase().replace(/[\s\\/]+/g, '_')
}

export default snakify
