function EmptyObj() { }
EmptyObj.prototype = Object.create(null);

export default <A, B>(a: A, b: B): A & B => {
    const o = new EmptyObj;

    let key: string;

    for (key in a)
        o[key] = a[key];
    for (key in b)
        o[key] = b[key];

    return o;
}
