using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Onboarding_Task.Models;
using Onboarding_Task.ViewModels;

namespace Onboarding_Task.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController: ControllerBase
    {
        private readonly OnboardingTaskDbContext _context;

        public StoreController(OnboardingTaskDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<Store>>> AsyncGetStores()
        {
            try {
                var stores = await _context.Stores.ToListAsync();
                if (stores == null)
                {
                    return NotFound("No store data");
                }
                return stores;
            }
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Store>> AsyncGetStore(int? id)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (_context.Stores == null)
                {
                    return NotFound();
                }
                var store = await _context.Stores.FindAsync(id);

                if (store == null)
                {
                    return NotFound("No store data for this id");
                }

                return store;
            }
            catch (Exception ex) {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> AsyncPutStore(int? id, CreateStoreRequest storeReq)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try {
                if (storeReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (id != storeReq.Id)
                {
                    return NotFound("No store data for this id");
                }

                _context.Entry(new Store()
                {
                    Address = storeReq.Address,
                    Name = storeReq.Name,
                    Id = storeReq.Id,
                }).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StoreExists(id))
                {
                    return NotFound("No store data for this id");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpPost]
        public async Task<ActionResult<Store>> AsyncPostStore(CreateStoreRequest storeReq)
        {
            try 
            { 
                if (storeReq == null)
                {
                    return NotFound("Your request is null or invalid");
                }

                if (_context.Stores == null)
                {
                    return Problem("Entity set 'OnboardingTaskDbContext.Stores' is null.");
                }

                var store = new Store()
                {
                    Address = storeReq.Address,
                    Name = storeReq.Name,
                };
                _context.Stores.Add(store);
                await _context.SaveChangesAsync();

                return CreatedAtAction("AsyncGetStore", new { id = store.Id }, store);
            }

            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> AsyncDeleteStore(int? id)
        {
            if (id == null)
            {
                return NotFound("id doesn't contain value");
            }

            try 
            { 
                if (_context.Stores == null)
                {
                    return NotFound("Entity set 'OnboardingTaskDbContext.Stores' is null.");
                }

                var store = await _context.Stores.FindAsync(id);
                if (store == null)
                {
                    return NotFound("No store data for this id");
                }

                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();

                return NoContent();
            }

            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        private bool StoreExists(int? id)
        {
            return (_context.Stores?.Any(e => e.Id == id)).GetValueOrDefault();
        }

    }
}
