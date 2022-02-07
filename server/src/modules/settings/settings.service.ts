import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { OverseerrApiService } from '../api/overseerr-api/overseerr-api.service';
import { PlexApiService } from '../api/plex-api/plex-api.service';
import { ServarrService } from '../api/servarr-api/servarr.service';
import { SettingDto } from "./dto's/setting.dto";
import { Settings } from './entities/settings.entities';

@Injectable()
export class SettingsService implements SettingDto {
  private readonly logger = new Logger(SettingsService.name);
  id: number;

  clientId: string;

  applicationTitle: string;

  applicationUrl: string;

  apikey: string;

  locale: string;

  cacheImages: number;

  plex_name: string;

  plex_hostname: string;

  plex_port: number;

  plex_ssl: number;

  plex_auth_token: string;

  overseerr_url: string;

  overseerr_api_key: string;

  radarr_url: string;

  radarr_api_key: string;

  sonarr_url: string;

  sonarr_api_key: string;

  collection_handler_job_cron: string;

  rules_handler_job_cron: string;

  constructor(
    @Inject(forwardRef(() => PlexApiService))
    private readonly plexApi: PlexApiService,
    @Inject(forwardRef(() => ServarrService))
    private readonly servarr: ServarrService,
    @Inject(forwardRef(() => OverseerrApiService))
    private readonly overseerr: OverseerrApiService,
    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>,
  ) {}

  public async init() {
    const settingsDb = await this.settingsRepo.findOne({ cache: false });
    if (settingsDb) {
      this.id = settingsDb?.id;
      this.clientId = settingsDb?.clientId;
      this.applicationTitle = settingsDb?.applicationTitle;
      this.applicationUrl = settingsDb?.applicationUrl;
      this.apikey = settingsDb?.apikey;
      this.locale = settingsDb?.locale;
      this.cacheImages = settingsDb?.cacheImages;
      this.plex_name = settingsDb?.plex_name;
      this.plex_hostname = settingsDb?.plex_hostname;
      this.plex_port = settingsDb?.plex_port;
      this.plex_ssl = settingsDb?.plex_ssl;
      this.plex_auth_token = settingsDb?.plex_auth_token;
      this.overseerr_url = settingsDb?.overseerr_url;
      this.overseerr_api_key = settingsDb?.overseerr_api_key;
      this.radarr_url = settingsDb?.radarr_url;
      this.radarr_api_key = settingsDb?.radarr_api_key;
      this.sonarr_url = settingsDb?.sonarr_url;
      this.sonarr_api_key = settingsDb?.sonarr_api_key;
      this.collection_handler_job_cron =
        settingsDb?.collection_handler_job_cron;
      this.rules_handler_job_cron = settingsDb?.rules_handler_job_cron;
    } else {
      this.logger.log('Settings not found.. Creating initial settings');
      await this.settingsRepo.insert({
        apikey: this.generateApiKey(),
      });
      this.init();
    }
  }

  public async getSettings() {
    return this.settingsRepo.findOne();
  }

  public async updateSettings(
    settings: Settings,
  ): Promise<{ code: 0 | 1; message: string }> {
    try {
      const settingsDb = await this.settingsRepo.findOne();
      await this.settingsRepo.save({
        ...settingsDb,
        ...settings,
      });
      await this.init();
      this.logger.log('Settings updated');
      this.plexApi.initialize({});
      this.servarr.init();
      this.overseerr.init();
      return { code: 1, message: 'Success' };
    } catch (e) {
      this.logger.error('Something went wrong while updating settings');
      return { code: 0, message: 'Failure' };
    }
  }

  public generateApiKey(): string {
    return Buffer.from(`${Date.now()}${randomUUID()})`).toString('base64');
  }
}
