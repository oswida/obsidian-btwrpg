import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { LANGS, PluginSettings } from "src/common/types";

export class SettingTab extends PluginSettingTab {
	plugin: Plugin;
	settings: PluginSettings;

	constructor(app: App, plugin: Plugin, settings: PluginSettings) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = settings;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Game element locale")
			.setDesc(
				"Determines the language of game element names (attributes, saves etc.)"
			)
			.addDropdown((cb) => {
				cb.addOptions(LANGS);
				cb.setValue(this.settings.locale);
				cb.onChange(async (value) => {
					this.settings.locale = value;
					await this.plugin.saveData(this.settings);
				});
			});
	}
}
