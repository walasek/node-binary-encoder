const bin = require('../../');

// A basic structure definition
const Person = bin.Structure({
    first_name: bin.String(),
    age: bin.Uint32(),
});

const Image = bin.Structure({
    binary: bin.Data(),
});
const Link = bin.Structure({
    url: bin.String(),
});

// A Protobuf-style OneOf union
const Attachment = bin.OneOf({
    image: Image,
    link: Link,
});

// Definitions can be nested
const MyMessage = bin.Structure({
    title: bin.String(),
    from: Person,
    to: Person,
    content: bin.String(),
    attachments: bin.Array(Attachment),
});

module.exports = MyMessage;