import {ItemView, WorkspaceLeaf} from 'obsidian';
import TaskwarriorPlugin from './main';


export default class TaskwarriorView extends ItemView {
	plugin: TaskwarriorPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: TaskwarriorPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getIcon() {
		return "check-square";
	}

	// This method should return a string that is unique to your view
	getViewType(): string {
		return "taskwarrior-view";
	}

	// This method should return the display name for the view
	getDisplayText(): string {
		return "Taskwarrior Tasks";
	}

	// This method is where you should render the contents of your view
	async onOpen() {
		// Clear existing content
		this.contentEl.empty();

		// Add title
		const title = this.containerEl.createEl('h2', {text: "Taskwarrior Tasks"});
		title.style.marginBottom = '10px';

		// Refresh button
		const refreshButton = this.containerEl.createEl('button', {text: "Refresh"});
		refreshButton.style.marginLeft = '10px';
		refreshButton.title = 'Refresh task list';
		refreshButton.addEventListener('click', () => {
			this.plugin.showTasks(); // Call showTasks method of the plugin
		});
		title.insertAdjacentElement('afterend', refreshButton);

		// Enable scrolling
		this.containerEl.style.overflowY = 'auto';
		this.containerEl.style.maxHeight = 'calc(100vh - 60px)';
		this.containerEl.style.padding = '10px';

		// Access the tasks array from the plugin
		const tasks = this.plugin.tasks;

		// Render the tasks in a table
		if (tasks && tasks.length > 0) {
			// Create table
			const table = this.containerEl.createEl('table');
			table.style.width = '100%';
			table.style.borderCollapse = 'collapse';

			// Create header row
			const headerRow = table.createEl('tr');
			['ID', 'P', 'Description'].forEach(headerText => {
				const header = headerRow.createEl('th');
				header.textContent = headerText;
				header.style.border = '1px solid #ccc';
				header.style.padding = '8px';
				header.style.textAlign = 'left';
			});

			// Populate table with task rows
			tasks.forEach((task) => {
				const row = table.createEl('tr');

				// ID
				const idCell = row.createEl('td');
				idCell.textContent = task.id.toString();
				idCell.style.border = '1px solid #ccc';
				idCell.style.padding = '8px';

				// Priority
				const priorityCell = row.createEl('td');
				priorityCell.textContent = task.priority || ''; // Assuming task.priority contains the priority
				priorityCell.style.border = '1px solid #ccc';
				priorityCell.style.padding = '8px';

				// Description
				const descriptionCell = row.createEl('td');
				descriptionCell.textContent = task.description;
				descriptionCell.style.border = '1px solid #ccc';
				descriptionCell.style.padding = '8px';
			});
		} else {
			this.containerEl.createEl('div', {text: 'No pending tasks.'});
		}
	}

	updateTasks() {
		this.onOpen();
	}
}

