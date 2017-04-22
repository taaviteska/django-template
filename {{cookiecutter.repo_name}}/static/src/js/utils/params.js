const paramMap = params => param => `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`;

const encodeParams = params => Object.keys(params).map(paramMap(params)).join('&');

export default encodeParams;
