namespace AngularTodoList.Migrations
{
    using AngularTodoList.Models;
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<AngularTodoList.Models.AngularTodoListContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(AngularTodoListContext context)
        {
            var r = new Random();
            var items = Enumerable.Range(1, 50).Select(o => new Todo
            {
                DueDate = new DateTime(2015, r.Next(1, 12), r.Next(1, 28)),
                Priority = (byte)r.Next(10),
                Text = o.ToString()
            }).ToArray();
        }
    }
}
