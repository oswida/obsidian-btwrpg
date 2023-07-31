/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, MarkdownRenderChild, MarkdownRenderer, Plugin } from "obsidian";
import { sprintf } from "printf-ts";
import { attrBonusInfo, attrNames, miscNames, saveNames } from "./lang";
import { PluginSettings } from "src/common";

const attrBonus = (level: number) => {
	switch (level) {
		case 1:
			return "-4";
		case 2:
		case 3:
			return "-3";
		case 4:
		case 5:
			return "-2";
		case 6:
		case 7:
		case 8:
			return "-1";
		case 9:
		case 10:
		case 11:
		case 12:
			return "0";
		case 13:
		case 14:
		case 15:
			return "+1";
		case 16:
		case 17:
			return "+2";
		default:
			return "+3";
	}
};

export class PcStat extends MarkdownRenderChild {
	statblockEl: HTMLDivElement;
	app: App;
	plugin: Plugin;
	settings: PluginSettings;

	constructor(
		containerEl: HTMLElement,
		context: string,
		private params: any,
		app: App,
		plugin: Plugin,
		settings: PluginSettings
	) {
		super(containerEl);
		this.app = app;
		this.plugin = plugin;
		this.settings = settings;
		this.statblockEl = this.containerEl.createDiv({
			cls: "btwrpg-statblock",
		});

		if (params.name) {
			this.renderDiv(
				this.statblockEl,
				params.name,
				context,
				"btwrpg-title"
			);
		}

		let stat = "";
		if (params.class) {
			stat = params.class;
		}
		if (params.level) {
			stat = sprintf(
				"%s, %s %s",
				stat,
				miscNames[this.settings.locale]["level"],
				params.level
			);
		}
		if (params.alignment) {
			stat = sprintf("%s, %s", stat, params.alignment);
		}

		this.renderDiv(this.statblockEl, stat, context, "btwrpg-note");

		const r1 = this.statblockEl.createDiv({ cls: "btwrpg-row" });
		r1.setCssProps({ gap: "30px", "flex-wrap": "wrap" });

		if (params.attr) {
			const c = r1.createDiv({ cls: "btwrpg-column" });
			c.setCssProps({ gap: "5px" });
			params.attr.forEach((element: any, idx: number) => {
				this.addAttr(c, idx, element, attrBonus(element));
			});
		}

		if (params.saves) {
			const c = r1.createDiv({ cls: "btwrpg-column" });
			c.setCssProps({ gap: "5px" });
			this.renderDiv(
				c,
				sprintf("_%s_", miscNames[this.settings.locale]["Saves"]),
				context
			);
			params.saves.forEach((element: any, idx: number) => {
				this.addSave(c, idx, element);
			});
		}

		if (params.ac || params.fp || params.hp) {
			const c = r1.createDiv({ cls: "btwrpg-column" });
			c.setCssProps({ gap: "5px" });
			if (params.ac) {
				this.addValue(c, "AC", params.ac);
			}
			if (params.fp) {
				this.addValue(c, "FP", params.fp);
			}
			if (params.hp) {
				this.addValue(c, "HP", params.hp);
			}
		}
	}

	renderDiv(el: HTMLDivElement, text: string, context: string, cls?: string) {
		const d = el.createDiv({ cls: cls });
		MarkdownRenderer.render(this.app, text, d, context, this.plugin);
	}

	addAttr(el: HTMLDivElement, idx: number, value: number, bonus: string) {
		const d = el.createDiv({ cls: "btwrpg-attr" });
		d.createDiv({ text: attrNames[this.settings.locale][idx] });
		d.createDiv({ text: value.toString() });
		d.createDiv({ text: bonus }).setAttribute(
			"title",
			attrBonusInfo[this.settings.locale][idx]
		);
	}

	addSave(el: HTMLDivElement, idx: number, value: number) {
		const d = el.createDiv({ cls: "btwrpg-save" });
		d.createDiv({ text: saveNames[this.settings.locale][idx] });
		d.createDiv({ text: value.toString() });
	}

	addValue(el: HTMLDivElement, title: string, value: number) {
		const d = el.createDiv({ cls: "btwrpg-value" });
		d.createDiv({ text: miscNames[this.settings.locale][title] });
		d.createDiv({ text: value.toString() });
	}
}
