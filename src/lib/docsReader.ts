export const readDocx = async (file:File) => {
    const buffer = await file.arrayBuffer();
    return buffer;
}   