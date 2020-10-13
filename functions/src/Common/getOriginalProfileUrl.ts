export const getOriginalProfileUrl = (normalUrl: string) => {
    return normalUrl.replace('_normal', '')
}