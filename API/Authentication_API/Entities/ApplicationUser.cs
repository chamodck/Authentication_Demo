using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication_API.Entities
{
    public class ApplicationUser : IdentityUser
    {
        [Column(TypeName ="nvarchar(20)")]
        public string FirstName { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string LastName { get; set; }
    }
}
