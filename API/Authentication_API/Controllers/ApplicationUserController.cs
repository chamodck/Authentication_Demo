using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Authentication_API.Entities;
using Authentication_API.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Authentication_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class ApplicationUserController : ControllerBase
    {
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _singInManager;
        private readonly ApplicationSettings _appSettings;
        private readonly ILogger<ApplicationUserController> _logger;
        public ApplicationUserController(UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<ApplicationSettings> appSettings,
            ILogger<ApplicationUserController> logger
            )
        {
            _userManager = userManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
            _logger = logger;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<Object> PostApplicationUser(ApplicationUserModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var applicationUser = new ApplicationUser() {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName=model.LastName
            };
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = result.Errors.First().Description });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var user = await _userManager.FindByNameAsync(model.UserName);
                if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
                {
                    var tokenDescriptor = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                        new Claim("UserID",user.Id.ToString())
                        }),
                        Expires = DateTime.UtcNow.AddDays(1),

                        Issuer = _appSettings.Issuer,
                        Audience = _appSettings.Client_URL,
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                    var token = tokenHandler.WriteToken(securityToken);
                    return Ok(new { token });
                }
                else
                    return BadRequest(new { message = "Username or password is incorrect." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return BadRequest();
            }
        }
    }
}