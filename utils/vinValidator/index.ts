const vinRegex = /^([A-Z\d]){17}$/;

const isValidVin = (vin: string) => vinRegex.test(vin);

export default isValidVin;