const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'BOT_TOKEN';
const targetGuildId = 'YOUR_SERVER_ID'; // Replace with your server's ID

let newUserCount = 0; // Initialize the count of new members

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  // Set the bot's status with an emoji
  client.user.setActivity('DM me the word "bread" 🍞', { type: 'WATCHING' });
});

client.on('guildMemberAdd', async member => {
  if (member.guild.id === targetGuildId) {
    try {
      newUserCount++; // Increment the new user count
      const ordinal = getOrdinal(newUserCount); // Get the ordinal suffix (e.g., 1st, 2nd, 3rd, ...)

      // Send the initial DM with the modified description
      const dmMessage = `You have been infected.

i have changed your status to “DM me the word "bread" "

The infection shall spread silently. The only rule is to not spoil the game for others by telling people what saying bread does. Gotta keep the status for a week. Welcome to the new epidemic, my boy. You are the ${ordinal} member to be infected by bread. We're still trying to find the cure.`;
      await member.send(dmMessage);

      // Send the infection status embed as a DM
      const infectionEmbed = new Discord.MessageEmbed()
        .setTitle('Infection Status')
        .setDescription(`We have infected our ${ordinal} member. Our infection has not yet grown.`);
      await member.send({ embeds: [infectionEmbed] });

      // Setting the infected user's status
      await member.setPresence({
        activities: [{ name: 'DM me the word "bread"', type: 'WATCHING' }],
        status: 'online',
      });

      // Check if the server's member count reaches a thousand
      const guild = await client.guilds.fetch(targetGuildId);
      if (guild.memberCount >= 1000) {
        await member.send('Our infection has risen. The infection has now spread to a thousand members!');
      }

      // After a week, update the infected user's status
      setTimeout(async () => {
        const botMember = await guild.members.fetch(client.user.id);

        await member.setPresence({
          activities: [{ name: 'DM me the word "bread"', type: 'WATCHING' }],
          status: 'online',
        });

        // Send a message confirming the infection
        await member.send('The infection has taken over. Keep an eye on your status for a week!');
      }, 7 * 24 * 60 * 60 * 1000); // 1 week in milliseconds
    } catch (error) {
      console.error(`Failed to send message to ${member.user.tag}: ${error}`);
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
        await targetUser.send('You have been infected by bread! Do NOT change your status for a week.');
        message.reply(`Successfully infected ${targetUser.tag} with the bread infection.`);
      } catch (error) {
        console.error(`Failed to infect ${targetUser.tag}: ${error}`);
        message.reply(`Failed to infect ${targetUser.tag}.`);
      }
    } else {
      const embed = new Discord.MessageEmbed()
        .setTitle('Friend Not Found')
        .setDescription(`The friend with the tag "${friendTag}" was not found.`);
      message.reply({ embeds: [embed] });
    }
  } else if (message.content.startsWith('/about')) {
    const embed = new Discord.MessageEmbed()
      .setTitle('About BreadBot')
      .setDescription('BreadBot is a fun bot that infects people with the bread! 🍞')
      .addField('Creator', 'imyeb (elishere404)')
      .addField('Version', '1.0.0')
      .setImage('https://media.tenor.com/jM34V0MnmkwAAAAC/fast-spinning-beget-bread.gif')
      .setColor('#FFD700'); // Gold color

    message.reply({ embeds: [embed] });
  }
});

// After a week, reset the infected user's status
client.on('presenceUpdate', async (oldPresence, newPresence) => {
  if (
    newPresence &&
    newPresence.userID &&
    newPresence.userID === newPresence.guild.me.user.id &&
    newPresence.status === 'online'
  ) {
    setTimeout(async () => {
      const botMember = await newPresence.guild.members.fetch(newPresence.userID);

      await botMember.setPresence({
        activities: [{ name: 'DM me the word "bread"', type: 'WATCHING' }],
        status: 'online',
      });
    }, 7 * 24 * 60 * 60 * 1000); // Reset status after 1 week
  }
});

function getOrdinal(number) {
  const suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
  const remainder = number % 100;

  return number + (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
}

client.login(token);
