export interface Video {
    job_id?: string
    path: string
    title: string
    description: string
    tags?: string[]
    language?: string
    playlist?: string
    function?: any
    thumbnail?: string
    publishType?: 'PRIVATE' | 'UNLISTED' | 'PUBLIC'
    onSuccess?: (url: string) => void
    skipProcessingWait?: boolean
    onProgress?: (arg0: VideoProgress) => void
    channelName?: string
    uploadAsDraft?: boolean
    isAgeRestriction?: boolean
    isNotForKid?: boolean
    isChannelMonetized?: boolean
    subtitle?: string
    gameTitleSearch?: string
    gameSelector?: ( arg0: GameData ) => Promise<boolean> | null
}

export interface MessageTransport {
    log: (message: any) => void
    userAction: (message: string) => void
    onSmsVerificationCodeSent?: () => Promise<string | undefined>
}

export enum ProgressEnum {
    Uploading,
    Processing,
    Done
}

export interface VideoProgress {
    progress: number
    stage: ProgressEnum
}

export interface VideoToEdit {
    link: string
    title?: string
    description?: string
    tags?: string[]
    replaceTags?: string[]
    language?: string
    playlist?: string
    function?: any
    thumbnail?: string
    publishType?: 'private' | 'unlisted' | 'public' | 'public&premiere'
    onSuccess?: Function
    channelName: string
    isAgeRestriction?: boolean
    isNotForKid?: boolean
    gameTitleSearch?: string
    gameSelector?: ( arg0: GameData ) => Promise<boolean> | null
}

export interface Comment {
    link: string
    comment: string
    live?: boolean
    onSuccess?: Function
    pin?: boolean
}

export interface Credentials {
    email: string
    pass: string
    recoveryemail?: string | undefined
    job_id?: string
    port: number
}

export interface GameData {
    title: string
    year?: string
    mid?: string
}