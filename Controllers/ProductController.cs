using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ProductController: ControllerBase
    {
        private readonly OnboardingTaskDbContext _context;

        public ProductController(OnboardingTaskDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> AsyncGetProducts()
        {
            try {
                var products = await _context.Products.ToListAsync();
                if (products == null)
                {
                    return NotFound("No product data");
                }
                return products;
            }
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> AsyncGetProduct(int? id)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (_context.Products == null)
                {
                    return NotFound();
                }
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    return NotFound("No product data for this id");
                }

                return product;
            }
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> AsyncPutProduct(int? id, CreateProductRequest productReq)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (productReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (id != productReq.Id)
                {
                    return NotFound("No product data for this id");
                }
            
                _context.Entry(new Product()
                {
                    Id = productReq.Id,
                    Name = productReq.Name,
                    Price = productReq.Price
                }).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound("No product data for this id");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Product>> AsyncPostProduct(CreateProductRequest productReq)
        {
            try
            {
                if (productReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (_context.Products == null)
                {
                    return Problem("Entity set 'OnboardingTaskDbContext.Products' is null.");
                }
            
                var product = new Product()
                {
                    Name = productReq.Name,
                    Price = productReq.Price
                };
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction("AsyncGetProduct", new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> AsyncDeleteProduct(int? id)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }
            
            try {
                if (_context.Products == null)
                {
                    return NotFound("Entity set 'OnboardingTaskDbContext.Customers' is null.");
                }

                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    return NotFound("No product data for this id");
                }
             
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private bool ProductExists(int? id)
        {
            return (_context.Products?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
