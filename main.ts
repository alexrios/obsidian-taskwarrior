import { Plugin, WorkspaceLeaf } from 'obsidian';
import { exec } from 'child_process';
import TaskwarriorView from './taskwarrior-view';

export default class TaskwarriorPlugin extends Plugin {
	tasks: any[] = [];

	async onload() {
		this.registerView('taskwarrior-view', (leaf: WorkspaceLeaf) => new TaskwarriorView(leaf,this));

		this.addCommand({
			id: 'show-taskwarrior-tasks',
			name: 'Show Taskwarrior Tasks',
			callback: () => {
				this.showTasks()
			}
		});
	}

	async showTasks() {
		// export pending tasks in JSON format
		var command = 'task status:pending export';

		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Error executing Taskwarrior: ${error}`, stderr);
				return;
			}
			const tasks = this.parseTasks(stdout);

			// Sort tasks by urgency in descending order
			tasks.sort((a, b) => b.urgency - a.urgency);
			this.tasks = tasks.slice(0, 5);
			// Try to find an existing Taskwarrior view
			const existingLeaf = this.app.workspace.getLeavesOfType('taskwarrior-view')[0];

			// If the Taskwarrior view is already open, refresh it
			if (existingLeaf) {
				const view = existingLeaf.view as TaskwarriorView;
				view.updateTasks(); // Call a custom method to refresh the view content
			} else {
				// If the Taskwarrior view is not open, create a new leaf (panel) and open your custom view in it
				const leaf = this.app.workspace.getRightLeaf(false);
				leaf.setViewState({ type: 'taskwarrior-view' });
			}
		});
	}

	parseTasks(rawData: string) {
		let tasks;
		try {
			// Parse the JSON output from Taskwarrior
			tasks = JSON.parse(rawData);
		} catch (error) {
			console.error('Error parsing Taskwarrior output:', error);
			return [];
		}
		return tasks;
	}
}

