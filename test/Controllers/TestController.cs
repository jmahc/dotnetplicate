using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;

namespace Dotnetplicate.Controllers
{
    /// <summary>
    /// Values controller.
    /// </summary>
    [Area(areaName: "ValuesController")]
    [Authorize]
    [Route(template: "api/[controller]")]
    public class ValuesController : Controller
    {
        /// <summary>
        /// The logger that writes files.
        /// </summary>
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="T:Dotnetplicate.Controllers.ValuesController"/> class.
        /// </summary>
        public ValuesController(ILoggerFactory loggerFactory)
        {
            // Logging any issues in the `BaseController`.
            _logger = loggerFactory.CreateLogger<ValuesController>();
        }

        /// <summary>
        /// Get this instance.
        /// </summary>
        /// <returns>The get.</returns>
        // GET api/values
        [HttpGet]
        [ProducesResponseType(type: typeof(string[]), statusCode: 200)]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        /// <summary>
        /// Get the specified id.
        /// </summary>
        /// <returns>The get.</returns>
        /// <param name="id">Identifier.</param>
        // GET api/values/5
        [HttpGet(template: "{id}")]
        [ProducesResponseType(type: typeof(string), statusCode: 200)]
        public string Get(int id)
        {
            return $"value {id}";
        }

        /// <summary>
        /// Post the specified value.
        /// </summary>
        /// <returns>The post.</returns>
        /// <param name="value">Value.</param>
        // POST api/values
        [HttpPost]
        [ProducesResponseType(type: typeof(OkObjectResult), statusCode: 200)]
        [ProducesResponseType(type: typeof(string), statusCode: 400)]
        public ActionResult Post([FromBody]string value)
        {
            if (value == null)
            {
                return BadRequest(error: "No post data was entered.");
            }
            return new OkObjectResult(value: value);
        }

        /// <summary>
        /// Put the specified id and value.
        /// </summary>
        /// <returns>The put.</returns>
        /// <param name="id">Identifier.</param>
        /// <param name="value">Value.</param>
        // PUT api/values/5
        [HttpPut(template: "{id}")]
        [ProducesResponseType(type: typeof(OkObjectResult), statusCode: 200)]
        [ProducesResponseType(type: typeof(string), statusCode: 400)]
        public ActionResult Put(int id, [FromBody]string value)
        {
            if (value == null)
            {
                return BadRequest(error: "No post data was entered.");
            }
            return new OkObjectResult(
                value: new
                {
                    putId = id,
                    putValue = value
                }
            );
        }

        /// <summary>
        /// Delete the specified id.
        /// </summary>
        /// <returns>The delete.</returns>
        /// <param name="id">Identifier.</param>
        // DELETE api/values/5
        [HttpDelete(template: "{id}")]
        [ProducesResponseType(type: typeof(OkObjectResult), statusCode: 200)]
        public ActionResult Delete(int id)
        {
            return new OkObjectResult(value: id);
        }
    }
}
