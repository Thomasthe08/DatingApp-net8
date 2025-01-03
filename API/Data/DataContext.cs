using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>(options)
{
    // public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>().HasMany(ur => ur.UserRoles).WithOne(u => u.User).HasForeignKey(ur => ur.UserId).IsRequired();
        builder.Entity<AppRole>().HasMany(ur => ur.UserRoles).WithOne(u => u.Role).HasForeignKey(ur => ur.RoleId).IsRequired();

        //OnDelete(DeleteBehavior.Cascade) ถ้าคุณมีตาราง Orders และ OrderDetails และคุณลบข้อมูลจาก Orders ที่มีความสัมพันธ์แบบ cascade กับ OrderDetails ข้อมูลที่เกี่ยวข้องใน OrderDetails จะถูกลบตามไปด้วยโดยอัตโนมัติ
        builder.Entity<UserLike>().HasKey(k => new { k.SourceUserId, k.TargetUserId });
        builder.Entity<UserLike>().HasOne(s => s.SourceUser).WithMany(l => l.LikedUsers).HasForeignKey(s => s.SourceUserId).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<UserLike>().HasOne(s => s.TargetUser).WithMany(l => l.LikedByUsers).HasForeignKey(s => s.TargetUserId).OnDelete(DeleteBehavior.NoAction); //sql server = has error use DeleteBehavior.NoAction, Sqlite=Cascade

        //OnDelete(DeleteBehavior.Restrict) ถ้าคุณพยายามลบข้อมูลในตาราง Orders แต่มีข้อมูลที่เกี่ยวข้องใน OrderDetails อยู่ ระบบจะไม่อนุญาตให้ลบข้อมูลใน Orders จนกว่าข้อมูลใน OrderDetails
        builder.Entity<Message>().HasOne(x => x.Sender).WithMany(x => x.MessagesSent).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Message>().HasOne(x => x.Recipient).WithMany(x => x.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
    }
}
