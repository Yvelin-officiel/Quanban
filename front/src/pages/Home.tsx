import { useEffect, useState } from 'react';
import axios from 'axios';

type Foo = {
  _id: string;
  name: string;
};

export default function Home() {
  const [foos, setFoos] = useState<Foo[]>([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/foo')
      .then(res => setFoos(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Foos</h1>
      <ul className="list-disc pl-5">
        {foos.map(foo => (
          <li key={foo._id}>{foo.name}</li>
        ))}
      </ul>
    </div>
  );
}
