import iconv from 'iconv-lite';
import encodings from 'iconv-lite/encodings';
iconv.encodings = encodings;
require('../../node_modules/mysql2/node_modules/iconv-lite/lib').encodingExists('foo');
