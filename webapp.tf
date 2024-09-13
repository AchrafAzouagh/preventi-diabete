provider "aws" {
  region = "eu-west-1"
}

resource "aws_instance" "webapp" {
  ami           = "ami-0fa8fe6f147dc938b"
  instance_type = "t3.large"

  tags = {
    Name = "webapp-instance"
  }
}
