const auth = require('./auth');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');

/**
 * Titration scheme
 *
 * 1. allow everyone into a room -- the waiting room, jaa, the rules, announcements;
 * 2. add each new person to an array
 * 3. at a certain interval,
 * 		pop a WAVE of the X oldest users,
 * 		granting them the mik role
 */

/**
 * Startup --
 *	When the client is ready, run this code (only once).
 *		The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
 *		It makes some properties non-nullable.
 */

let bot_instance = {
	max_ingresses_per_period: 10,
	wave_period: 60 * 1000 * 60,
	titrating: false,
	titration_callback: null,
	users: [],
	guild: null,
	MIK_ROLE_ID: '1225891567378894960',
	GUILD_ID: auth.GUILD_ID,
	BOT_ID: auth.BOT_ID,
	initialize,
	apply_mik,
	titrate,
	get_users,
	set_period,
	set_max_ingresses,
	approve_all_before,
	enable_titration,
	enable_titration_after,
	disable_titration,
	get_first_unapproved,
	is_everyone_approved,
};

if (require.main === module) {
	bot_instance.initialize();
}

function initialize() {
	const client = new Client({
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildMembers,
			GatewayIntentBits.GuildInvites,
		],
	});

	client.commands = new Collection();

	const foldersPath = path.join(__dirname, 'commands');
	const commandFolders = fs.readdirSync(foldersPath);

	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
				);
			}
		}
	}

	//init slash commands

	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(
				`No command matching ${interaction.commandName} was found.`
			);
			return;
		}

		try {
			await command.execute(interaction, bot_instance);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					ephemeral: true,
				});
			}
		}
	});

	client.once(Events.ClientReady, (readyClient) => {
		console.log(`Ready! Logged in as ${readyClient.user.tag}`);
		bot_instance.guild = client.guilds.cache.get(bot_instance.GUILD_ID);
	});

	client.login(auth.djs_token);
}

function apply_mik(user) {
	//todo
}

function titrate() {
	if (!titrating) return;

	//begin turnstiling/titrating people into the server starting from `timestamp`
	// max_ingresses_per_period
	// wave_period
	let ingresses = 0;
	for (const user of users) {
		if (
			user.joinedAt > timestamp &&
			!user.roles.includes(bot_instance.MIK_ROLE_ID)
		) {
			apply_mik(user);
			ingresses++;
			if (ingresses > max_ingresses_per_period) {
				return;
			}
		}
	}
}

async function get_users() {
	bot_instance.users = await bot_instance.guild.members.fetch();
	return bot_instance.users;
}

/**
 * SLASH COMMANDS
 */

function set_period(_wave_period) {
	wave_period = _wave_period;
}

function set_max_ingresses(_max_ingresses_per_period) {
	max_ingresses_per_period = _max_ingresses_per_period;
}

function approve_all_before(timestamp) {
	let users = get_users();
	for (const user of users) {
		if (user.joinedAt < timestamp) {
			apply_mik(user);
		}
	}
}

function enable_titration() {
	enable_titration_after(get_first_unapproved().joinedAt);
}

function enable_titration_after(timestamp) {
	titrating = true;
	titration_callback = setInterval(titrate, wave_period);
}

function disable_titration() {
	titrating = false;
	clearInterval(titration_callback);
}

async function get_first_unapproved() {
	let users = await get_users();
	users.sort((a, b) => a.joinedAt - b.joinedAt);
	for await (let u of users) {
		if (!is_approved(u[1])) {
			return u[1];
		}
	}

	return null;
}

function is_approved(user) {
	return user.roles.cache.has(bot_instance.MIK_ROLE_ID);
}

async function is_everyone_approved() {
	let users = await get_users();
	let i = 0;
	users.sort((a, b) => a.joinedAt - b.joinedAt);
	users.forEach((u) => {
		if (is_approved(u)) {
			i++

		};
	});

	console.log(`${i} users of ${users.length} are approved.`);
}
