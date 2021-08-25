"""template for python scripts"""
from datetime import datetime
import git
MODE = "debug"



def main():
    repo = git.Repo("/Users/matthew.hoss/demos/demo")
    print (repo.is_dirty())
    repo_push = repo.push('origin','main')
    print (repo_push)
    """main function"""
    clear_log()
    #g = git.cmd.Git()
    
    log("this is a test")


def clear_log():
    """clear log file"""
    if MODE == "debug":
        log_line = f"start {str(datetime.today())} \n\n"
        with open("temp/log.txt", "w", encoding="latin-1") as myfile:
            myfile.write(log_line)
    return ()


def log(write_line):
    """write to the log file"""
    if MODE == "debug":
        with open("temp/log.txt", "a", encoding="latin-1") as myfile:
            myfile.write(write_line)
    return ()


if __name__ == "__main__":
    main()
