using Microsoft.EntityFrameworkCore;
using PlayerAssociationAPI.Models;

namespace PlayerAssociationAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // REMOVED: OnConfiguring method - it conflicts with DI configuration

        public DbSet<Player> Players { get; set; }
        public DbSet<PlayerImage> PlayerImages { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventImage> EventImages { get; set; }
        public DbSet<Insight> Insights { get; set; }
        public DbSet<InsightImage> InsightImages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // PLAYER MODEL CONFIG
            modelBuilder.Entity<Player>(entity =>
            {
                entity.Property(p => p.FullName)
                      .IsRequired()
                      .HasMaxLength(200);
                
                entity.Property(p => p.CreatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");
                
                entity.Property(p => p.UpdatedAt)
                      .ValueGeneratedOnUpdate();
            });

            // EVENT MODEL CONFIG
            modelBuilder.Entity<Event>(entity =>
            {
                entity.Property(e => e.Title)
                      .IsRequired()
                      .HasMaxLength(200);
                
                entity.Property(e => e.CreatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");
                
                entity.Property(e => e.UpdatedAt)
                      .ValueGeneratedOnUpdate();
            });

            // INSIGHT MODEL CONFIG
            modelBuilder.Entity<Insight>(entity =>
            {
                entity.Property(i => i.Title)
                      .IsRequired()
                      .HasMaxLength(200);
                
                entity.Property(i => i.Category)
                      .HasConversion<string>()
                      .HasMaxLength(50);
                
                entity.Property(i => i.CreatedAt)
                      .HasDefaultValueSql("GETUTCDATE()");
                
                entity.Property(i => i.UpdatedAt)
                      .ValueGeneratedOnUpdate();
            });
        }
    }
}