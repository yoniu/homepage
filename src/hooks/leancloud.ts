import AV from 'leancloud-storage'

AV.init({
    appId: process.env.APP_ID as string,
    appKey: process.env.API_KEY as string,
    serverURL: process.env.REST_API as string,
})

export default function useLeancloud() {
    return AV
}
