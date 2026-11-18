import {redirect} from 'react-router';

// Hatwater House has a single collection, the California Collection, which
// lives at /collections/all. Send the template's collections index there.
export function loader() {
  return redirect('/collections/all', 301);
}
