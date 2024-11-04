import AV from 'leancloud-storage'

AV.init({
    appId: process.env.NEXT_PUBLIC_APP_ID as string,
    appKey: process.env.NEXT_PUBLIC_API_KEY as string,
    serverURL: process.env.NEXT_PUBLIC_REST_API as string,
})

export default function useLeancloud() {
    return AV
}
