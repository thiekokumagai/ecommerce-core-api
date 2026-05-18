import { Injectable } from '@nestjs/common';
import { StoreSettings } from '../entities/store-settings.entity';
import { ISettingsRepository } from '../repositories/isettings.repository';

export interface UpdateSettingsInput {
  storeName: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  topHeaderText?: string | null;
  bannerUrls?: string[];
  phone: string;
  instagram?: string | null;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string | null;
  hideAddress: boolean;
  pixEnabled: boolean;
  pixKeyType?: string | null;
  pixKey?: string | null;
  pixHolder?: string | null;
  payOnDeliveryCash: boolean;
  payOnDeliveryCardDebit: boolean;
  payOnDeliveryCardCredit: boolean;
  paymentRules?: any;
}

@Injectable()
export class UpdateSettingsUseCase {
  constructor(private readonly settingsRepository: ISettingsRepository) {}

  async execute(input: UpdateSettingsInput): Promise<StoreSettings> {
    return this.settingsRepository.save({
      storeName: input.storeName,
      logoUrl: input.logoUrl ?? null,
      faviconUrl: input.faviconUrl ?? null,
      topHeaderText: input.topHeaderText ?? null,
      bannerUrls: input.bannerUrls ?? [],
      phone: input.phone,
      instagram: input.instagram ?? null,
      cep: input.cep,
      street: input.street,
      number: input.number,
      neighborhood: input.neighborhood,
      city: input.city,
      state: input.state,
      complement: input.complement ?? null,
      hideAddress: input.hideAddress,
      pixEnabled: input.pixEnabled,
      pixKeyType: input.pixKeyType ?? null,
      pixKey: input.pixKey ?? null,
      pixHolder: input.pixHolder ?? null,
      payOnDeliveryCash: input.payOnDeliveryCash,
      payOnDeliveryCardDebit: input.payOnDeliveryCardDebit,
      payOnDeliveryCardCredit: input.payOnDeliveryCardCredit,
      paymentRules: input.paymentRules ?? [],
    });
  }
}
