class InvalidEncodeValue extends Error {};
class InvalidDecodeBuffer extends Error {};
class MissingFields extends Error {};
class InvalidDescriptor extends Error {};
class AmbiguousObject extends Error {};

module.exports = {
	InvalidEncodeValue,
	InvalidDecodeBuffer,
	MissingFields,
	InvalidDescriptor,
	AmbiguousObject,
};