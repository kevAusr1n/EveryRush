using EveryRush.Authorization;
using EveryRush.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace ContactManager.Authorization
{
    public class BusinessOwnerAuthorizationHandler
                : AuthorizationHandler<OperationAuthorizationRequirement, Product>
    {
        UserManager<IdentityUser> _userManager;

        public BusinessOwnerAuthorizationHandler(UserManager<IdentityUser> 
            userManager)
        {
            _userManager = userManager;
        }

        protected override Task
            HandleRequirementAsync(AuthorizationHandlerContext context,
                                   OperationAuthorizationRequirement requirement,
                                   Product resource)
        {
            if (context.User == null || resource == null)
            {
                return Task.CompletedTask;
            }

            if (requirement.Name != Constants.CreateOperationName &&
                requirement.Name != Constants.ReadOperationName   &&
                requirement.Name != Constants.UpdateOperationName &&
                requirement.Name != Constants.DeleteOperationName )
            {
                return Task.CompletedTask;
            }

            if (resource.AppUserId == _userManager.GetUserId(context.User))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}