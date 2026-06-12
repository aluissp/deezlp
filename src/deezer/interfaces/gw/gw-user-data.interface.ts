export interface GWUserData {
	USER: User;
	SETTING_LANG: string;
	SETTING_LOCALE: string;
	DIRECTION: string;
	SESSION_ID: string;
	USER_TOKEN: string;
	PLAYLIST_WELCOME_ID: string;
	OFFER_ID: number;
	OFFER_NAME: string;
	OFFER_ELIGIBILITIES: any[];
	COUNTRY: string;
	COUNTRY_CATEGORY: string;
	MIN_LEGAL_AGE: number;
	FAMILY_KIDS_AGE: number;
	SERVER_TIMESTAMP: number;
	PLAYER_TOKEN: string;
	checkForm: string;
	FROM_ONBOARDING: string;
	CUSTO: string;
	SETTING_REFERER_UPLOAD: string;
	REG_FLOW: string[];
	LOGIN_FLOW: string[];
	__DZR_GATEKEEPS__: { [key: string]: boolean };
	thirdParty: ThirdParty;
	URL_MEDIA: string;
	GAIN: Gain;
	checkFormLogin: string;
}

interface Gain {
	TARGET: string;
	ADS: string;
}

interface User {
	USER_ID: number;
	USER_PICTURE: string;
	INSCRIPTION_DATE: string;
	TRY_AND_BUY: TryAndBuy;
	PARTNERS: string;
	TOOLBAR: any[];
	OPTIONS: Options;
	AUDIO_SETTINGS: AudioSettings;
	SETTING: Setting;
	LASTFM: Apple;
	TWITTER: Apple;
	FACEBOOK: Apple;
	GOOGLEPLUS: Apple;
	APPLE: Apple;
	FAVORITE_TAG: number;
	ABTEST: Abtest;
	MULTI_ACCOUNT: any[];
	ONBOARDING_MODAL: boolean;
	ADS_OFFER: string;
	ENTRYPOINTS: Apple;
	ADS_TEST_FORMAT: string;
	NEW_USER: boolean;
	CONSENT_STRING: any[];
	RECOMMENDATION_COUNTRY: string;
	CAN_BE_CONVERTED_TO_INDEPENDENT: boolean;
	IS_FREEMIUM_COUNTRY: number;
	HARDBOUNCED_EMAIL: boolean;
	EXPLICIT_CONTENT_LEVEL: string;
	EXPLICIT_CONTENT_LEVELS_AVAILABLE: string[];
	CAN_EDIT_EXPLICIT_CONTENT_LEVEL: boolean;
	DEVICES_COUNT: number;
	HAS_UPNEXT: boolean;
	LOVEDTRACKS_ID: string;
	OPTINS: Optins;
}

interface Abtest {
	share_android_image_preview: ModuleLibraryAbtestQA;
	module_library_abtest_qa: ModuleLibraryAbtestQA;
	poc_aampe: ModuleLibraryAbtestQA;
}

interface ModuleLibraryAbtestQA {
	id: string;
	option: string;
	behaviour: string;
	percent: number;
}

interface Apple {}

interface AudioSettings {
	default_preset: string;
	default_download_on_mobile_network: boolean;
	presets: Preset[];
	connected_device_streaming_preset: string;
}

interface Preset {
	mobile_download: string;
	mobile_streaming: string;
	wifi_download: string;
	wifi_streaming: string;
	id: string;
	title: string;
	description: string;
}

interface Optins {
	channel: any[];
	optin: any[];
	group: any[];
}

interface Options {
	mobile_preview: boolean;
	mobile_radio: boolean;
	mobile_streaming: boolean;
	mobile_streaming_duration: number;
	mobile_offline: boolean;
	mobile_sound_quality: SoundQuality;
	default_download_on_mobile_network: boolean;
	mobile_hq: boolean;
	mobile_lossless: boolean;
	tablet_sound_quality: SoundQuality;
	audio_quality_default_preset: string;
	web_preview: boolean;
	web_radio: boolean;
	web_streaming: boolean;
	web_streaming_duration: number;
	web_offline: boolean;
	web_hq: boolean;
	web_lossless: boolean;
	web_sound_quality: SoundQuality;
	license_token: string;
	expiration_timestamp: number;
	license_country: string;
	ads_display: boolean;
	ads_audio: boolean;
	dj: boolean;
	nb_devices: number;
	multi_account: boolean;
	multi_account_max_allowed: number;
	radio_skips: number;
	too_many_devices: boolean;
	business: boolean;
	business_mod: boolean;
	business_box_owner: boolean;
	business_box_manager: boolean;
	business_box: boolean;
	business_no_right: boolean;
	allow_subscription: boolean;
	allow_trial_mobile: boolean;
	timestamp: number;
	can_subscribe: boolean;
	can_subscribe_family: boolean;
	show_subscription_section: boolean;
	streaming_group: string;
	queuelist_edition: boolean;
	mobile_streaming_used: number;
	web_streaming_used: number;
	streaming_used: number;
	ads: boolean;
	multiaccount_max_children: number;
	audio_qualities: AudioQualities;
	hq: boolean;
	lossless: boolean;
	offline: boolean;
	preview: boolean;
	radio: boolean;
	streaming: boolean;
	streaming_duration: number;
	sound_quality: SoundQuality;
}

interface AudioQualities {
	mobile_download: string[];
	mobile_streaming: string[];
	wifi_download: string[];
	wifi_streaming: string[];
}

interface SoundQuality {
	low?: boolean;
	standard: boolean;
	high: boolean;
	lossless: boolean;
	reality: boolean;
}

interface Setting {
	global: Global;
	site: Site;
	twitter: GoogleClass;
	facebook: GoogleClass;
	google: GoogleClass;
	notification_mail: NotificationM;
	notification_mobile: NotificationM;
	newsletter: Newsletter;
	optin_mail: any[];
	optin_push: any[];
	optin_inapp: any[];
	optin_sms: any[];
	tips: Tips;
	audio_quality_settings: AudioQualitySettings;
	customer_message: any[];
	mobile_message: any[];
	adjust: any[];
	abtest: any[];
	ads: Ads;
	webviews: Webviews;
	tracking: any[];
	partner: Partner;
}

interface Ads {
	test_format: boolean;
	force_adsource: string;
	force_mediation: string;
}

interface AudioQualitySettings {
	preset: string;
	download_on_mobile_network: boolean;
	connected_device_streaming_preset: boolean;
}

interface GoogleClass {
	share_comment: boolean;
	share_favourite: boolean;
	share_loved: boolean;
	share_listen?: boolean;
	share_share: boolean;
	country_store?: boolean;
}

interface Global {
	language: string;
	social: boolean;
	popup_unload: boolean;
	filter_explicit_lyrics: boolean;
	is_kid: boolean;
	has_up_next: boolean;
	dark_mode: string;
	accent_palette_identifier: string;
	onboarding: boolean;
	onboarding_progress: number;
	onboarding_musictogether: boolean;
	onboarding_musictogether_progress: number;
	cookie_consent_string: string;
	has_root_consent: number;
	happy_hour: string;
	recommendation_country: string;
	has_joined_family: boolean;
	has_already_tried_premium: boolean;
	explicit_level_forced: boolean;
}

interface Newsletter {
	editor: boolean;
	talk: boolean;
	event: boolean;
	game: boolean;
	special_offer: boolean;
	panel: boolean;
}

interface NotificationM {
	share: boolean;
	friend_follow: boolean;
	playlist_comment: boolean;
	playlist_follow: boolean;
	artist_new_release: boolean;
	artist_status: boolean;
	new_message: boolean;
}

interface Partner {
	partner_ids: string;
}

interface Site {
	livebar_state: string;
	livebar_tab: string;
	push_mobile: number;
	howto_step: number;
	edito_tag: number;
	display_confirm_discovery: number;
	cast_audio_quality: string;
}

interface Tips {
	player: boolean;
	flow: boolean;
	add_to_library: boolean;
	lyrics: number;
	up_next: boolean;
}

interface Webviews {
	domain: boolean;
}

interface TryAndBuy {
	AVAILABLE: boolean;
	ACTIVE: string;
	DATE_START: string;
	DATE_END: string;
	PLATEFORM: string;
	DAYS_LEFT_MOB: number;
}

interface ThirdParty {
	facebook: ThirdPartyFacebook;
	googleplus: Googleplus;
	braze: Braze;
}

interface Braze {
	apiKey: string;
	isAvailable: boolean;
}

interface ThirdPartyFacebook {
	appData: FacebookAppData;
	lang: string;
}

interface FacebookAppData {
	id: number;
	namespace: string;
	scope: string;
	version: string;
	channel: string;
}

interface Googleplus {
	appData: GoogleplusAppData;
}

interface GoogleplusAppData {
	client_id: string;
	client_key: string;
	name: string;
	scope: string;
	redirect_uri: string;
	access_type: string;
	cookie_policy: string;
	request_visible_actions: string;
	version: string;
}
