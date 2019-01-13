export default function read_next() {
  read_while(is_whitespace);
  if (input.eof()) return null;
  var ch = input.peek();
  if (ch == "#") {
    skip_comment();
    return read_next();
  }
  if (ch == '"') return read_string();
  if (is_digit(ch)) return read_number();
  if (is_id_start(ch)) return read_ident();
  if (is_punc(ch))
    return {
      type: "punc",
      value: input.next()
    };
  if (is_op_char(ch))
    return {
      type: "op",
      value: read_while(is_op_char)
    };
  input.croak("Can't handle character: " + ch);
}
