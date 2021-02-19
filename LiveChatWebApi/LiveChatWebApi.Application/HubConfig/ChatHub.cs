using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace LiveChatWebApi.Application.HubConfig
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string userName, string message, string time)
        {
            await Clients.All.SendAsync("ReceiveMessage", userName, message, time);
        }
    }
}