import mongoose from 'mongoose';

const fooSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Foo = mongoose.model('Foo', fooSchema);

export default Foo;
