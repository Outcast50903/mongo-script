const vinRegex = /^([A-Z\d]){17}$/

const isValidVin = (vin: string): boolean => vinRegex.test(vin)

export default isValidVin
