using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication_API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Authentication_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private readonly ILogger<ApplicationUserController> _logger;
        public UserProfileController(UserManager<ApplicationUser> userManager,
            ILogger<ApplicationUserController> logger
            )
        {
            _userManager = userManager;
            _logger = logger;
        }

        [HttpGet]
        [Authorize]
        //GET : /api/UserProfile
        public async Task<Object> GetUserProfile() 
        {
            try
            {
                string userId = User.Claims.First(c => c.Type == "UserID").Value;
                var user = await _userManager.FindByIdAsync(userId);
                return new
                {
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.UserName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }   
    }
}