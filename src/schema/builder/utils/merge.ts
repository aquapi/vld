export default <A, B>(a: A, b: B): A & B => {
    for (var key in b)
        // @ts-ignore
        a[key] = b[key];

    // @ts-ignore
    return a;
}
