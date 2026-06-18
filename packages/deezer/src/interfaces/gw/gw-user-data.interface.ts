/**
 * Interface representing the raw user data returned by the Deezer GW API.
 */
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
}

interface Gain {
	TARGET: string;
	ADS: string;
}

interface User {
	USER_ID: number;
	USER_PICTURE: string;
	INSCRIPTION_DATE: Date;
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
	MULTI_ACCOUNT: MultiAccount;
	ONBOARDING_MODAL: boolean;
	ADS_OFFER: string;
	ENTRYPOINTS: Entrypoints;
	ADS_TEST_FORMAT: string;
	NEW_USER: boolean;
	CONSENT_STRING: any[];
	RECOMMENDATION_COUNTRY: string;
	CAN_BE_CONVERTED_TO_INDEPENDENT: boolean;
	IS_FREEMIUM_COUNTRY: number;
	HARDBOUNCED_EMAIL: boolean;
	ADS_CONFIG: AdsConfig;
	EXPLICIT_CONTENT_LEVEL: string;
	EXPLICIT_CONTENT_LEVELS_AVAILABLE: string[];
	CAN_EDIT_EXPLICIT_CONTENT_LEVEL: boolean;
	BLOG_NAME: string;
	FIRSTNAME: string;
	LASTNAME: string;
	USER_GENDER: string;
	USER_AGE: string;
	EMAIL: string;
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

interface AdsConfig {
	SEGMENTS: any[];
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

interface Entrypoints {
	LYRICS_PANEL: ConversionBannerFree;
	AUDIO_SETTING_PREMIUM: AudioSettingPremium;
	CONVERSION_BANNER_FREE: ConversionBannerFree;
	SUBSCRIBE_FROM_SETTINGS: ConversionBannerFree;
	SUBSCRIBE_FROM_USER_PROFILE: ConversionBannerFree;
}

interface AudioSettingPremium {
	label: string;
	action: string;
}

interface ConversionBannerFree {
	label: string;
	description?: string;
	action: string;
	origin?: string;
}

interface MultiAccount {
	ENABLED: boolean;
	ACTIVE: boolean;
	CHILD_COUNT: null;
	MAX_CHILDREN: null;
	PARENT: null;
	IS_KID: boolean;
	IS_SUB_ACCOUNT: boolean;
}

interface Optins {
	channel: ChannelElement[];
	group: ChannelElement[];
	optin: Optin[];
	service_name: string;
}

interface ChannelElement {
	name: string;
	label: string;
	description: string;
}

interface Optin {
	name: string;
	label: string;
	description: string;
	channel: OptinChannel;
	group: Group;
	channels_requiring_validation: any[];
}

interface OptinChannel {
	optin_push?: boolean;
	optin_sms?: boolean;
	optin_mail?: boolean;
	optin_whatsapp?: boolean;
}

export enum Group {
	Extras = 'extras',
	Music = 'music',
	Podcasts = 'podcasts',
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
	upgrade: Upgrade;
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

interface Upgrade {
	type: string;
	offer: Offer;
	cta: Cta;
}

interface Cta {
	label: string;
	label_extend: string;
	log_name: string;
}

interface Offer {
	id: number;
	name: string;
	description: string;
	duration: number;
	price: Price;
}

interface Price {
	amount: string;
	currency: string;
	display: string;
}

interface Setting {
	newsletter: Newsletter;
	global: Global;
	site: Site;
	twitter: GoogleClass;
	facebook: GoogleClass;
	google: GoogleClass;
	notification_mail: NotificationM;
	notification_mobile: NotificationM;
	beta_user: BetaUser;
	tips: Tips;
	audio_quality_settings: AudioQualitySettings;
	ads: Ads;
	adjust: Adjust;
	customer_message: CustomerMessage;
	location: Location;
	optin_mail: OptinInappClass;
	optin_push: OptinInappClass;
	optin_inapp: OptinInappClass;
	optin_sms: OptinInappClass;
	webviews: Webviews;
	partner: Partner;
}

interface Adjust {
	device: { [key: string]: Device };
	dzero_stream: number;
	first_stream_id: number;
	devicesInfo: DevicesInfo;
}

interface Device {
	login: Login;
}

interface Login {
	last_trigger: number;
}

interface DevicesInfo {
	'293562af-2cf3-4cc0-a847-02e4eb93557c': The293562_AF2_Cf34_Cc0A84702_E4Eb93557C;
	'ce1121e8-674e-4f6f-8442-d9f3916126d8': Ce1121E8674E4F6F8442D9F3916126D8;
	'203276b8070375941a9c32158f4d8f38': The203276B8070375941A9C32158F4D8F38;
	'940aa42e-c27c-46f1-b5fa-e228d9dbd0e9': The293562_AF2_Cf34_Cc0A84702_E4Eb93557C;
}

interface The203276B8070375941A9C32158F4D8F38 {
	identifier_type: string;
	platform: string;
	device_identifier: string;
	device_identifier_type: string;
}

interface The293562_AF2_Cf34_Cc0A84702_E4Eb93557C {
	identifier_type: string;
}

interface Ce1121E8674E4F6F8442D9F3916126D8 {
	identifier_type: string;
	has_adid: string;
}

interface Ads {
	featurefm_token: FeaturefmToken;
	test_format: boolean;
	force_adsource: string;
	force_mediation: string;
}

interface FeaturefmToken {
	token: string;
	date: Date;
	api_url: string;
}

interface AudioQualitySettings {
	preset: string;
	device_streaming_quality: boolean;
	download_on_mobile_network: boolean;
	connected_device_streaming_preset: boolean;
}

interface BetaUser {
	ios: boolean;
	android: boolean;
	windowsphone: boolean;
	windows: boolean;
}

interface CustomerMessage {
	conversion_pplus: ConversionPplus;
	push_trialend_freexp: Push;
	whats_new_flow: WhatsNewFlow;
	push_collect_optin: Push;
}

interface ConversionPplus {
	android: Android;
	desktop: Desktop;
}

interface Android {
	reg_d1: boolean;
	trial_end_period: TrialEndPeriod;
	seasonal_offer: string;
}

interface TrialEndPeriod {
	'20181017': boolean;
}

interface Desktop {
	reg_d1: boolean;
	trial_end: boolean;
	seasonal_offer: string;
}

interface Push {
	properties: any[];
	display_count: number;
	last_display: Date;
}

interface WhatsNewFlow {
	is_eligible: boolean;
	triggered: boolean;
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
	onboarding_progress: number;
	cookie_consent_string: string;
	happy_hour: string;
	social: boolean;
	popup_unload: boolean;
	filter_explicit_lyrics: boolean;
	is_kid: boolean;
	has_up_next: boolean;
	dark_mode: string;
	onboarding: boolean;
	has_root_consent: number;
	recommendation_country: string;
	has_joined_family: boolean;
	explicit_level_forced: boolean;
	accent_palette_identifier: string;
	onboarding_musictogether: boolean;
	onboarding_musictogether_progress: number;
	has_already_tried_premium: boolean;
}

interface Location {
	city: string;
	lat: number;
	lon: number;
	source: string;
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

interface OptinInappClass {
	update: number;
	special_offer: number;
	social: number;
	event: number;
	third_party: number;
	survey: number;
}

interface Partner {
	partner_ids: string;
}

interface Site {
	version: string;
	player_fade: number;
	player_hq: boolean;
	player_audio_quality: string;
	push_audiobooks: boolean;
	nb_flowplayer_like_notification: number;
	labs: Labs;
	livebar_state: string;
	livebar_tab: string;
	push_mobile: number;
	howto_step: number;
	edito_tag: number;
	display_confirm_discovery: number;
	cast_audio_quality: string;
}

interface Labs {
	ElectronUI: boolean;
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
	DATE_START: Date;
	DATE_END: Date;
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
