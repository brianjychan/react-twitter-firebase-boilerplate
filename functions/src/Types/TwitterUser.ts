// When updating, be sure all frontend versions are updated
// Also search through codebase for where the type is used

// This is saved the format of the document at prof/{uid}/sensitive/twitterData
export interface TwitterUser {
    id: number;
    id_str: string;
    name: string;
    screen_name: string;
    location: string;
    description: string;
    url: string;
    email?: string;
    entities?: Entities;
    protected: boolean;
    followers_count: number;
    friends_count: number;
    listed_count: number;
    created_at: string;
    favourites_count: number;
    utc_offset?: null;
    time_zone?: null;
    geo_enabled: boolean;
    verified: boolean;
    statuses_count: number;
    lang?: null;
    status?: Status;
    contributors_enabled: boolean;
    is_translator: boolean;
    is_translation_enabled: boolean;
    profile_background_color: string;
    profile_background_image_url: string;
    profile_background_image_url_https: string;
    profile_background_tile: boolean;
    profile_image_url: string;
    profile_image_url_https: string;
    profile_banner_url: string;
    profile_link_color: string;
    profile_sidebar_border_color: string;
    profile_sidebar_fill_color: string;
    profile_text_color: string;
    profile_use_background_image: boolean;
    has_extended_profile: boolean;
    default_profile: boolean;
    default_profile_image: boolean;
    following: boolean;
    follow_request_sent: boolean;
    notifications: boolean;
    translator_type: string;
    suspended: boolean;
    needs_phone_verification: boolean;
}
export interface Entities {
    url: Url;
    description: Description;
}
export interface Url {
    urls?: (UrlsEntity)[] | null;
}
export interface UrlsEntity {
    url: string;
    expanded_url: string;
    display_url: string;
    indices?: (number)[] | null;
}
export interface Description {
    urls?: (null)[] | null;
}
export interface Status {
    created_at: string;
    id: number;
    id_str: string;
    text: string;
    truncated: boolean;
    entities: Entities1;
    source: string;
    in_reply_to_status_id?: null;
    in_reply_to_status_id_str?: null;
    in_reply_to_user_id?: null;
    in_reply_to_user_id_str?: null;
    in_reply_to_screen_name?: null;
    geo?: null;
    coordinates?: null;
    place?: null;
    contributors?: null;
    is_quote_status: boolean;
    retweet_count: number;
    favorite_count: number;
    favorited: boolean;
    retweeted: boolean;
    lang: string;
}
export interface Entities1 {
    hashtags?: (null)[] | null;
    symbols?: (null)[] | null;
    user_mentions?: (null)[] | null;
    urls?: (UrlsEntity)[] | null;
}