const { Client, GatewayIntentBits, MessageEmbed } = require('discord.js');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.Friends],
});
const token = 'YOUR_BOT_TOKEN'; // Replace with your bot token

// Store the original statuses of infected members
const originalStatuses = new Map();

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('guildMemberAdd', async member => {
    if (member.guild.id === 'YOUR_SPECIFIC_SERVER_ID') { // Replace with your server's ID
        try {
            await member.send(' Do NOT change your status for a week, and do NOT tell anybody what bread does, especially to a SNITCH!! 😡.');
            console.log(`Sent infection message to ${member.user.tag}`);

            // Store the member's original status
            originalStatuses.set(member.id, member.presence.status);
            
            // Set the member's status to "DM me the word 'bread'" for a week
            const statusMessage = 'DM me the word "bread"';
            member.presence.setActivities([{ name: statusMessage, type: 'WATCHING' }]);
            
            // After a week, reset the member's status to what it was before
            setTimeout(() => {
                const originalStatus = originalStatuses.get(member.id) || 'online';
                member.presence.setStatus(originalStatus);
                originalStatuses.delete(member.id);
            }, 7 * 24 * 60 * 60 * 1000); // Reset status after 1 week
        } catch (error) {
            console.error(`Failed to send infection message to ${member.user.tag}: ${error}`);
        }
    }
});

client.on('message', async message => {
    if (message.content.startsWith('/infect')) {
        const args = message.content.split(' ');
        const friendTag = args[1];
        const targetUser = friendTag ? client.users.cache.find(user => user.tag === friendTag) : message.author;
        
        if (targetUser) {
            try {
                await targetUser.send('You have been infected by bread! Do NOT change your status for a week, and do NOT tell anybody what bread does, especially to a SNITCH!! 😡');
                message.reply(`Successfully infected ${targetUser.tag} with the bread infection.`);
            } catch (error) {
                console.error(`Failed to infect ${targetUser.tag}: ${error}`);
                message.reply(`Failed to infect ${targetUser.tag}.`);
            }
        } else {
            const embed = new MessageEmbed()
                .setTitle('Friend Not Found')
                .setDescription(`The friend with the tag "${friendTag}" was not found.`);
            message.reply({ embeds: [embed] });
        }
    } else if (message.content.startsWith('/about')) {
        const embed = new MessageEmbed()
            .setTitle('About BreadBot')
            .setDescription('BreadBot is a fun bot that infects people with the bread! 🍞')
            .addField('Creator', 'imyeb (elishere404 on github)')
            .addField('Version', '1.0.0')
            .setImage('https://media.tenor.com/jM34V0MnmkwAAAAC/fast-spinning-beget-bread.gif')
            .setColor('#FFD700'); // Gold color
        
        message.reply({ embeds: [embed] });
    }
});

client.login(token);
